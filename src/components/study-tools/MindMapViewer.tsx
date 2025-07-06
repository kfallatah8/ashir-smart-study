
import React, { useMemo, useCallback } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  ConnectionMode,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { MindMapNode, MindMapEdge } from '@/lib/documents';

interface MindMapViewerProps {
  nodes: MindMapNode[];
  edges: MindMapEdge[];
}

// Custom node styles based on node type
const getNodeStyle = (nodeType?: string) => {
  const baseStyle = {
    padding: '10px 15px',
    borderRadius: '8px',
    border: '2px solid',
    fontSize: '14px',
    fontWeight: '500',
    minWidth: '120px',
    textAlign: 'center' as const,
  };

  switch (nodeType?.toLowerCase()) {
    case 'root':
    case 'main':
      return {
        ...baseStyle,
        backgroundColor: '#3b82f6',
        color: 'white',
        borderColor: '#2563eb',
        fontSize: '16px',
        fontWeight: '600',
        minWidth: '150px',
      };
    case 'topic':
    case 'branch':
      return {
        ...baseStyle,
        backgroundColor: '#10b981',
        color: 'white',
        borderColor: '#059669',
      };
    case 'subtopic':
    case 'leaf':
      return {
        ...baseStyle,
        backgroundColor: '#f59e0b',
        color: 'white',
        borderColor: '#d97706',
      };
    default:
      return {
        ...baseStyle,
        backgroundColor: '#6366f1',
        color: 'white',
        borderColor: '#4f46e5',
      };
  }
};

// Convert mind map data to React Flow format
const convertToReactFlowFormat = (nodes: MindMapNode[], edges: MindMapEdge[]) => {
  // Create a simple auto-layout algorithm
  const nodePositions = new Map<string, { x: number; y: number }>();
  
  // Find root node (or use first node as root)
  const rootNode = nodes.find(n => n.type?.toLowerCase() === 'root' || n.type?.toLowerCase() === 'main') || nodes[0];
  if (rootNode) {
    nodePositions.set(rootNode.id, { x: 0, y: 0 });
  }

  // Simple circular layout for connected nodes
  const processedNodes = new Set<string>();
  const queue = rootNode ? [rootNode.id] : [];
  let level = 1;
  
  while (queue.length > 0) {
    const currentLevelSize = queue.length;
    const angleStep = (2 * Math.PI) / Math.max(currentLevelSize, 1);
    
    for (let i = 0; i < currentLevelSize; i++) {
      const nodeId = queue.shift()!;
      if (processedNodes.has(nodeId)) continue;
      
      processedNodes.add(nodeId);
      
      // Find connected nodes
      const connectedEdges = edges.filter(e => e.from === nodeId || e.to === nodeId);
      const connectedNodes = connectedEdges
        .map(e => e.from === nodeId ? e.to : e.from)
        .filter(id => !processedNodes.has(id));
      
      // Position connected nodes in a circle around current level
      connectedNodes.forEach((connectedNodeId, index) => {
        if (!nodePositions.has(connectedNodeId)) {
          const angle = angleStep * (i + index);
          const radius = level * 200;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          
          nodePositions.set(connectedNodeId, { x, y });
          queue.push(connectedNodeId);
        }
      });
    }
    level++;
  }

  // Convert nodes to React Flow format
  const reactFlowNodes: Node[] = nodes.map((node) => {
    const position = nodePositions.get(node.id) || { x: Math.random() * 400, y: Math.random() * 400 };
    
    return {
      id: node.id,
      data: { label: node.label },
      position,
      style: getNodeStyle(node.type),
      type: 'default',
    };
  });

  // Convert edges to React Flow format
  const reactFlowEdges: Edge[] = edges.map((edge, index) => ({
    id: edge.label ? `${edge.from}-${edge.to}-${edge.label}` : `${edge.from}-${edge.to}-${index}`,
    source: edge.from,
    target: edge.to,
    label: edge.label,
    type: 'smoothstep',
    style: { stroke: '#64748b', strokeWidth: 2 },
    labelStyle: { fontSize: '12px', fontWeight: '500' },
  }));

  return { nodes: reactFlowNodes, edges: reactFlowEdges };
};

const MindMapViewer: React.FC<MindMapViewerProps> = ({ nodes, edges }) => {
  const { nodes: reactFlowNodes, edges: reactFlowEdges } = useMemo(
    () => convertToReactFlowFormat(nodes, edges),
    [nodes, edges]
  );

  const [flowNodes, setNodes, onNodesChange] = useNodesState(reactFlowNodes);
  const [flowEdges, setEdges, onEdgesChange] = useEdgesState(reactFlowEdges);

  const onConnect = useCallback(() => {}, []);

  if (!nodes || nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>No mind map data available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-96 border rounded-lg bg-white">
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        connectionMode={ConnectionMode.Loose}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        style={{ backgroundColor: '#f8fafc' }}
      >
        <Controls />
        <MiniMap 
          nodeColor={(node) => {
            if (node.style?.backgroundColor) {
              return node.style.backgroundColor as string;
            }
            return '#6366f1';
          }}
          nodeStrokeWidth={3}
          zoomable
          pannable
        />
        <Background color="#e2e8f0" gap={20} />
      </ReactFlow>
    </div>
  );
};

export default MindMapViewer;

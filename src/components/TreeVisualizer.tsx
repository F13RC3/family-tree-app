import React from 'react';
import { View, Dimensions } from 'react-native';
import { Canvas, Circle, Line, Text as SkiaText, Group } from '@shopify/react-native-skia';
import { useFamilyStore } from '../store/useFamilyStore';
import { TreeNode } from '../types';

const { width } = Dimensions.get('window');
const NODE_RADIUS = 30;
const LEVEL_HEIGHT = 100;

interface NodeProps {
  node: TreeNode;
  x: number;
  y: number;
  selected?: boolean;
  onPress?: () => void;
}

function TreeNode({ node, x, y, selected, onPress }: NodeProps) {
  return (
    <Group>
      <Circle
        cx={x}
        cy={y}
        r={NODE_RADIUS}
        color={selected ? '#007AFF' : '#e0e0e0'}
        style="fill"
      />
      <Circle
        cx={x}
        cy={y}
        r={NODE_RADIUS}
        color="#333"
        style="stroke"
        strokeWidth={2}
      />
      <SkiaText
        x={x}
        y={y + 5}
        text={node.name.charAt(0).toUpperCase()}
        textAlign="center"
        fontSize={14}
        color="#000"
      />
    </Group>
  );
}

function Connection({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return <Line p1={{ x: x1, y: y1 }} p2={{ x: x2, y: y2 }} color="#999" strokeWidth={2} />;
}

export function TreeVisualizer() {
  const tree = useFamilyStore((s) => s.getTree());
  const selectedId = useFamilyStore((s) => s.selectedMemberId);

  const renderTree = (nodes: TreeNode[], depth = 0, xOffset = 0) => {
    if (nodes.length === 0) return null;

    const y = depth * LEVEL_HEIGHT + 80;
    const spacing = width / (nodes.length + 1);

    return nodes.map((node, i) => {
      const x = xOffset + spacing * (i + 1);
      const isSelected = node.id === selectedId;

      return (
        <Group key={node.id}>
          <TreeNode node={node} x={x} y={y} selected={isSelected} />
          {node.children.map((child, ci) => {
            const childX = x + spacing * (ci - node.children.length / 2 + 0.5);
            const childY = y + LEVEL_HEIGHT;
            return (
              <Group key={child.id}>
                <Connection x1={x} y1={y + NODE_RADIUS} x2={childX} y2={childY - NODE_RADIUS} />
                {renderTree([child], depth + 1, childX - spacing / 2)}
              </Group>
            );
          })}
        </Group>
      );
    });
  };

  return (
    <View className="flex-1 bg-white">
      <Canvas style={{ flex: 1 }}>
        {renderTree(tree)}
      </Canvas>
    </View>
  );
}

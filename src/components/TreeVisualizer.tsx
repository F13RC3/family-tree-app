import React, { useState } from 'react';
import { View, Dimensions, Text } from 'react-native';
import { Canvas, Circle, Line, Group, useTouchHandler, Rect } from '@shopify/react-native-skia';
import { useFamilyStore } from '../store/useFamilyStore';
import { TreeNode } from '../types';

const { width, height } = Dimensions.get('window');
const NODE_RADIUS = 30;
const LEVEL_HEIGHT = 120;

interface NodeProps {
  node: TreeNode;
  x: number;
  y: number;
  selected?: boolean;
}

function TreeNode({ node, x, y, selected }: NodeProps) {
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
      <Rect
        x={x - 40}
        y={y + NODE_RADIUS + 5}
        width={80}
        height={24}
        color="#fff"
        opacity={0.8}
      />
      <Rect
        x={x - 40}
        y={y + NODE_RADIUS + 5}
        width={80}
        height={24}
        color="#333"
        style="stroke"
        strokeWidth={1}
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

  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const touchHandler = useTouchHandler({
    onBegin: () => {},
    onStart: () => {},
    onMove: (e) => {
      setOffset((prev) => ({
        x: prev.x + e.translateX,
        y: prev.y + e.translateY,
      }));
    },
    onEnd: () => {},
    onPinch: (e) => {
      setScale((prev) => Math.max(0.5, Math.min(3, prev * e.scale)));
    },
  });

  const renderTree = (nodes: TreeNode[], depth = 0, xOffset = 0): React.ReactNode => {
    if (nodes.length === 0) return null;

    const y = depth * LEVEL_HEIGHT + 100;
    const spacing = Math.max(80, width / (nodes.length + 1));

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

  if (tree.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-500">No tree data. Add members and link relationships.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <Canvas
        style={{ flex: 1 }}
        touchHandler={touchHandler}
      >
        <Group transform={[{ translateX: offset.x }, { translateY: offset.y }, { scale }]}>
          {renderTree(tree)}
        </Group>
      </Canvas>
      <View className="absolute bottom-4 right-4 bg-gray-800 px-3 py-1 rounded">
        <Text className="text-white text-xs">Zoom: {(scale * 100).toFixed(0)}%</Text>
      </View>
    </View>
  );
}

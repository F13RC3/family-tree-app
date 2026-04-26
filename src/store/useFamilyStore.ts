import { create } from 'zustand';
import { FamilyMember, Relationship, TreeNode } from '../types';

interface FamilyState {
  members: FamilyMember[];
  relationships: Relationship[];
  selectedMemberId: string | null;

  setMembers: (members: FamilyMember[]) => void;
  addMember: (member: FamilyMember) => void;
  updateMember: (id: string, updates: Partial<FamilyMember>) => void;
  deleteMember: (id: string) => void;

  setRelationships: (rels: Relationship[]) => void;
  addRelationship: (rel: Relationship) => void;
  deleteRelationship: (id: string) => void;

  setSelectedMember: (id: string | null) => void;

  // Tree helpers
  getTree: () => TreeNode[];
  getMember: (id: string) => FamilyMember | undefined;
}

export const useFamilyStore = create<FamilyState>((set, get) => ({
  members: [],
  relationships: [],
  selectedMemberId: null,

  setMembers: (members) => set({ members }),
  addMember: (member) => set((s) => ({ members: [...s.members, member] })),
  updateMember: (id, updates) =>
    set((s) => ({
      members: s.members.map((m) => (m.id === id ? { ...m, ...updates } : m)),
    })),
  deleteMember: (id) =>
    set((s) => ({
      members: s.members.filter((m) => m.id !== id),
      relationships: s.relationships.filter(
        (r) => r.fromId !== id && r.toId !== id,
      ),
    })),

  setRelationships: (rels) => set({ relationships: rels }),
  addRelationship: (rel) => set((s) => ({ relationships: [...s.relationships, rel] })),
  deleteRelationship: (id) =>
    set((s) => ({ relationships: s.relationships.filter((r) => r.id !== id) })),

  setSelectedMember: (id) => set({ selectedMemberId: id }),

  getTree: () => {
    const { members, relationships } = get();
    const memberMap = new Map(members.map((m) => [m.id, m]));

    const buildNode = (id: string, depth = 0, visited = new Set<string>()): TreeNode => {
      if (visited.has(id)) {
        return {
          ...memberMap.get(id)!,
          children: [],
          parents: [],
          spouses: [],
          depth,
        };
      }
      visited.add(id);

      const parents = relationships
        .filter((r) => r.toId === id && r.type === 'parent')
        .map((r) => buildNode(r.fromId, depth + 1, visited));

      const children = relationships
        .filter((r) => r.fromId === id && r.type === 'parent')
        .map((r) => buildNode(r.toId, depth + 1, visited));

      const spouses = relationships
        .filter((r) => (r.fromId === id || r.toId === id) && r.type === 'spouse')
        .map((r) => buildNode(r.fromId === id ? r.toId : r.fromId, depth, visited));

      return {
        ...memberMap.get(id)!,
        children,
        parents,
        spouses,
        depth,
      };
    };

    const roots = members.filter((m) => {
      const hasParents = relationships.some(
        (r) => r.toId === m.id && r.type === 'parent',
      );
      return !hasParents;
    });

    return roots.map((r) => buildNode(r.id));
  },

  getMember: (id) => {
    return get().members.find((m) => m.id === id);
  },
}));

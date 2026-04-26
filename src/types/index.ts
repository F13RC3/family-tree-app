export interface FamilyMember {
  id: string;
  userId: string;
  name: string;
  dob?: string;
  gender?: 'male' | 'female' | 'other';
  avatarUrl?: string;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Relationship {
  id: string;
  userId: string;
  fromId: string;
  toId: string;
  type: 'parent' | 'spouse' | 'child';
  createdAt?: string;
}

export interface User {
  id: string;
  email: string;
}

export type TreeNode = FamilyMember & {
  children: TreeNode[];
  parents: TreeNode[];
  spouses: TreeNode[];
  depth: number;
};

export type Task = {
  id: string;
  title: string;
};

export type Assignment = {
  id: string;
  title: string;
  description: string;
  status: string;
}

export type User = {
  name: string;
  email: string;
  avatar: string;
}
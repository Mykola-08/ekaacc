import { allUsers } from './data';

export const fxUsers = {
  async getUsers() {
    return allUsers;
  },
  async updateUserRole(userId: string, role: string) {
    return { id: userId, role } as any;
  }
  ,
  async updateUser(userId: string, data: Record<string, any>) {
    return { id: userId, ...data } as any;
  }
};

export default fxUsers;

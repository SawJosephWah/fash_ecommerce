export interface UserAvatar {
  public_id: string;
  url: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  avatar?: UserAvatar;
}


export interface UserResponse {
  status: string;
  data: {
    user: User;
  };
}


export interface UpdatePasswordRequest {
  current_password: string;
  new_password: string;
}
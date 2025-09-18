export type UserFormData = {
  fullName: string;
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: string;
  enabled: boolean;
};

export const defaultForm: UserFormData = {
  fullName: "",
  username: "",
  email: "",
  phoneNumber: "",
  password: "",
  role: "",
  enabled: true,
};

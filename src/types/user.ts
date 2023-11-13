export type RequestUser = {
  id: string,
  firstname: string,
  lastname: string,
  role?: string,
  permissions?: string[],
  dealer?: any,
}

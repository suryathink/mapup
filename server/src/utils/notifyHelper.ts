import { io } from "..";

export const notifyNameSpace = (event: string, data: any) => {
  const dataNameSpace = io.of("/data");
  dataNameSpace.emit(event, data);
};

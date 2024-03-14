export interface ActivityResponse {
  id: string;
  season?: {
    id?: string;
    title?: string;
  };
  location?: {
    id?: string;
    name?: string;
  };
  workers:{
    id?: string;
    name?: string;
  }[]|[]
  inspectors:{
    id?: string;
    name?: string;
  }[]|[]
  tag?: string;
  title?: string;
  descriptions: ActivityDescription[]|[];
  isCompleted?: boolean;
  start?: Date;
  end?: Date;
  addition?: string[]|[]
}

export interface ActivityDescription {
  name: string;
  value: string;
}

export interface Addition{
  id: string;
  type: string;
  data: any;
}

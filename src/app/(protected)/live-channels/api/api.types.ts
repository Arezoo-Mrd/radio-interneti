type LiveResponseType = {
 id: number;
 name: string;
 description: string;
 start_date: string;
 end_date: string;
 start_time: string;
 end_time: string;
 activate: boolean;
 presenter: {
  name: string;
 }[];
};

export type GetAllLiveResponse = LiveResponseType[];

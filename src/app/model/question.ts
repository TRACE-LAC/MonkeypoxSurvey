import { Answer } from "./answer";

export interface Question {

   id : number;
   title: string;
   text: string;
   section: string;
   enabled: boolean;
   required: boolean;
   type: string;
   widgetType: string;
   definitions: string;
   parent: number;
   answersInJson: string;
   answersSelected: Answer[];
}

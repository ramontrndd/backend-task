export interface Task {
    id?: string;
    name: string;          
    cost: number;                
    endDate: string;        
    order?: number;         
}
export default Task;
export interface TaskModel {
  id:number;
  title:string;
  state?:'do'|'doing'|'done';
  editing?:boolean;
}

// Revisar la opcion para manejar el state como un arreglo de datos
/* Se maneja la interface para tner contorl de los datos que se van a tener en cada tarea
* Se exporta un filtro con las respectivas ociones segun el estado de nuestra tarea
*/
export type FilterType = 'all'| 'do' |'doing'|'done';

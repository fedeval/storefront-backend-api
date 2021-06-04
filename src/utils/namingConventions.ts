import { User } from '../models/user';

/* 
SQL and JS have different naming conventions:
- lower_snake_case: SQL columns
- camelCase: JS object properties
To avoid breaking conventions we can use this function to convert 
from SQL naming to JS when importing data from the DB 
*/
export const convertColNamesToUserProps = (
  id: number,
  username: string,
  first_name: string,
  last_name: string,
  password: string
): User => {
  const user: User = {
    id: id,
    username: username,
    firstName: first_name,
    lastName: last_name,
    password: password
  };
  return user;
};
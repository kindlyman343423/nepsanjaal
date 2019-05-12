import appconstants from './Constants';

const {base_url} = appconstants;

//Auth requests
export const signup = user => {
 return fetch(`${base_url}/signup`, {
     method: "POST",
     headers: {
         Accept: "application/json",
         "Content-Type": "application/json"
     },
     body: JSON.stringify(user)
 })
     .then(response => {
         return response.json();
     })
     .catch(err => console.log(err));
};
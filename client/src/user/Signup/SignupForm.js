import React from 'react'

const SignupForm = (props) => {
 const { name, email, password} = props.stateValues;
  return (
   <form>
   <div className="form-group">
     <label className="text-muted">Name</label>
     <input
       onChange={props.handleChange}
       type="text"
       name="name"
       className="form-control"
       value={name}
     />
   </div>
   <div className="form-group">
     <label className="text-muted">Email</label>
     <input
       onChange={props.handleChange}
       type="email"
       name="email"
       className="form-control"
       value={email}
     />
   </div>
   <div className="form-group">
     <label className="text-muted">Password</label>
     <input
       onChange={props.handleChange}
       type="password"
       name="password"
       className="form-control"
       value={password}
     />
   </div>
   <button
     onClick={props.clickSubmit}
     className="btn btn-raised btn-primary"
   >
     Submit
   </button>
 </form>
  )
}

export default SignupForm;
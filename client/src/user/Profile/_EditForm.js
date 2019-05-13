import React from "react";

const _EditForm = props => {
  const { stateValues, clickSubmit, handleChange } = props;
  const { name, email, password } = stateValues;
  return (
    <form>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          onChange={handleChange}
          type="text"
          className="form-control"
          name="name"
          value={name}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Email</label>
        <input
          onChange={handleChange}
          type="email"
          name="email"
          className="form-control"
          value={email}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Password</label>
        <input
          onChange={handleChange}
          type="password"
          name="password"
          className="form-control"
          value={password}
        />
      </div>
      <button onClick={clickSubmit} className="btn btn-raised btn-primary">
        Update
      </button>
    </form>
  );
};

export default _EditForm;

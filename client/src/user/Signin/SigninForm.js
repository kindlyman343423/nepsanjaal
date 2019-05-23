import React from "react";

const SigninForm = props => {
  const { email, password, recaptcha } = props.stateValues;
  return (
    <form>
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

      <div className="form-group">
        <label className="text-muted">
          {recaptcha ? "Thanks. You got it!" : "What day is today?"}
        </label>

        <input
          onChange={props.recaptchaHandler}
          type="text"
          className="form-control"
        />
      </div>

      <button
        onClick={props.clickSubmit}
        className="btn btn-raised btn-primary"
      >
        Submit
      </button>
    </form>
  );
};
export default SigninForm;

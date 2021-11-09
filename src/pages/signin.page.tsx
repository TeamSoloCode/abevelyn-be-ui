import React, { useCallback, useContext, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useForm } from "react-hook-form";
import AppContext from "../context/app.context";

export const SignInPage = React.memo(() => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const appContext = useContext(AppContext);

  const onSubmit = useCallback(
    (data) => {
      if (!appContext?.login) return;
      appContext.login(data["username"], data["password"]);
    },
    [appContext.login]
  );

  useEffect(() => {
    if (appContext.state.authenticated) {
      alert("Authenticated");
    }
  }, [appContext.state]);

  return (
    <div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Username</Form.Label>
          <Form.Control type="username" placeholder="Enter email" {...register("username")} />
          <Form.Text className="text-muted">We'll never share your email with anyone else.</Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" {...register("password")} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Check me out" />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
});

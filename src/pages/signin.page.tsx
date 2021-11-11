import React, { useCallback, useContext, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { SubmitHandler, useForm } from "react-hook-form";
import AppContext from "../context/app.context";
import { ISignInReqDto } from "../dto/signin/signin.req.dto";

export const SignInPage = React.memo(() => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ISignInReqDto>();

  const appContext = useContext(AppContext);

  const onSubmit: SubmitHandler<ISignInReqDto> = useCallback(
    ({ username, password }) => {
      if (!appContext?.login) return;
      appContext.login(username, password);
    },
    [appContext.login]
  );

  return (
    <Modal.Dialog>
      <Modal.Header closeButton>
        <Modal.Title>Sign In</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control type="username" placeholder="Enter email" {...register("username")} />
            <Form.Text className="text-muted">We'll never share your email with anyone else.</Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" {...register("password")} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check type="checkbox" label="Remember me" />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Modal.Footer>
      </Form>
    </Modal.Dialog>
  );
});

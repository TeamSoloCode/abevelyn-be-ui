import React from "react";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import { SubmitHandler, useForm } from "react-hook-form";
import { useParams } from "react-router";
import { userApi } from "../../client-api/api.client";
import { UserRoles } from "../../constanst";
import UsersContext from "../../context/user.context";
import { User } from "../../models/user.model";
import { showError } from "../../utils";
import { FieldText } from "../../components/FieldText";

export const UpdateAccount = React.memo(() => {
  const { userId } = useParams();
  const userContext = React.useContext(UsersContext);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [refreshToken, setRefreshToken] = React.useState(Date.now());

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<{ role: UserRoles }>();

  const onSubmit: SubmitHandler<{ role: UserRoles }> = React.useCallback(
    async ({ role }) => {
      if (!userContext?.updateUserRole || !userId) return;

      const isSuccess = await userApi.updateUserRole(userId, role);

      isSuccess && setRefreshToken(Date.now());
    },
    [userContext?.updateUserRole, userId, selectedUser]
  );

  React.useEffect(() => {
    if (!userId) return;

    (async (id: string) => {
      const response = await userApi.getUser(id);
      const result = await response.json();

      if (response.status == 200) {
        setSelectedUser(result.data);
      }

      showError(result?.message);
    })(userId);
  }, [userId, refreshToken]);

  return (
    <Col xs="9">
      <Card className="m-1">
        <Card.Body>
          <Card.Title>Update Collection</Card.Title>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Col>
              <FieldText label="Username" defaultValue={selectedUser?.username} disabled />
              <FieldText label="Email" defaultValue={selectedUser?.email} disabled />
              <Row>
                <Col>
                  <FieldText
                    flexColumns={[4, 8]}
                    label="First Name"
                    defaultValue={selectedUser?.profile?.firstName || ""}
                    disabled
                  />
                </Col>
                <Col>
                  <FieldText
                    flexColumns={[4, 8]}
                    label="Last Name"
                    defaultValue={selectedUser?.profile?.lastName || ""}
                    disabled
                  />
                </Col>
              </Row>
              <Row>
                <Col className="">
                  <Button type="submit" className="mb-2">
                    Submit
                  </Button>
                </Col>
                <Col></Col>
              </Row>
            </Col>
          </Form>
        </Card.Body>
      </Card>
    </Col>
  );
});

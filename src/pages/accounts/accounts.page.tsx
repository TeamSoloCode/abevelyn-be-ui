import moment from "moment";
import React from "react";
import Col from "react-bootstrap/Col";
import { useNavigate } from "react-router";
import { ClientApi, clientApi } from "../../client-api/api.client";
import { IColumn, TSCTable } from "../../components/TSCTable";
import { AppRoutes, DEFAULT_DATETIME_FORMAT } from "../../constanst";
import UsersContext from "../../context/user.context";
import { User } from "../../models/user.model";
import { getImageUrl } from "../../utils";

export const Accounts = React.memo(() => {
  const userContext = React.useContext(UsersContext);
  const state = userContext?.state;
  const accounts = state?.users || [];
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!userContext?.loadUsers) return;
    userContext.loadUsers();
  }, []);

  const columns = React.useMemo(() => {
    return defaultColumns;
  }, []);

  const onClickRow = React.useCallback(
    (item: User) => {
      navigate(`/${AppRoutes.UPDATE_USER}/${item.uuid}`);
    },
    [navigate]
  );

  return (
    <div>
      <TSCTable data={accounts || []} columns={columns} onRowClick={onClickRow} />
    </div>
  );
});

const defaultColumns: IColumn<User>[] = [
  {
    headerTitle: "Username",
    item: (item) => item.username,
  },
  {
    headerTitle: "Email",
    item: (item) => item.email,
  },
  {
    headerTitle: "Display Name",
    item: (item) => (item?.profile?.firstName || "") + (item?.profile?.lastName || ""),
  },
  {
    headerTitle: "Role",
    item: (item) => item.role?.toLocaleUpperCase(),
  },
  {
    headerTitle: "Image",
    item: (item) => (
      <div className="rounded overflow-hidden" style={{ width: 64, height: 64 }}>
        <img width={"100%"} height={"100%"} src={getImageUrl(item?.profile?.picture)} />
      </div>
    ),
  },
  {
    headerTitle: "Create At",
    item: (item) => moment(item.createdAt).format(DEFAULT_DATETIME_FORMAT),
  },
];

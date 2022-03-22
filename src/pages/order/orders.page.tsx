import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { AppRoutes, DEFAULT_DATETIME_FORMAT } from "../../constanst";
import { IColumn, TSCTable } from "../../components/TSCTable";
import OrderContext from "../../context/order.context";
import { Order } from "../../models/order.model";
import moment from "moment";

export const OrderPage = React.memo(() => {
  const orderContext = useContext(OrderContext);
  const state = orderContext?.state;
  const orders = state?.orders;

  const [showUpdateModal, setShowUpdateModel] = useState(false);
  let [selectedId, setSelectdId] = useState<string | undefined>(undefined);

  useEffect(() => {
    orderContext?.load();
  }, []);

  const openUpdateModal = useCallback(() => {
    setShowUpdateModel(true);
  }, [setShowUpdateModel]);

  const closeUpdateModal = useCallback(() => {
    setShowUpdateModel(false);
  }, [setShowUpdateModel]);

  const onClickRow = useCallback(
    (order: Order) => {
      setSelectdId(order.uuid);
      openUpdateModal();
    },
    [openUpdateModal, setSelectdId, selectedId]
  );

  const columns = useMemo(() => {
    return defaultColumns;
  }, []);

  return (
    <div>
      {/* <Col xs="auto">
        <a className="btn" href={`/${AppRoutes.CREATE_MATERIAL}`}>
          <Button className="mt-1">+ New Material</Button>
        </a>
      </Col> */}
      <TSCTable data={orders || []} columns={columns} onRowClick={onClickRow} />
    </div>
  );
});

const defaultColumns: IColumn<Order>[] = [
  {
    headerTitle: "Status",
    item: (item) => item.orderHist?.status?.toUpperCase(),
  },
  {
    headerTitle: "Username",
    item: (item) => item.owner?.username,
  },
  {
    headerTitle: "Phone Number",
    item: (item) => item.owner?.profile?.phone,
  },
  {
    headerTitle: "Email",
    item: (item) => item.owner?.email,
  },
  {
    headerTitle: "Products",
    item: (item) => {
      return item.orderHist?.cartItems?.map((cartItem) => {
        return (
          <div>
            <span>{cartItem.product?.name}</span>
            <span> x({cartItem.quantity})</span>
          </div>
        );
      });
    },
  },
  {
    headerTitle: "Origin Price",
    item: (item) => item.orderHist?.priceInfo?.totalPrice,
  },
  {
    headerTitle: "Final Price",
    item: (item) => item.orderHist?.priceInfo?.calculatedPrice,
  },
  {
    headerTitle: "Create At",
    item: (item) => moment(item.createdAt).format(DEFAULT_DATETIME_FORMAT),
  },
];

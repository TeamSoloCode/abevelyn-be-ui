import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import Table from "react-bootstrap/Table";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import ColorContext from "../context/colors.context";
import { CreateColor } from "../components/create-color";
import { UpdateColor } from "../components/update-color";

export const ColorsPage = React.memo(() => {
  const colorContext = useContext(ColorContext);
  const { colors } = colorContext.state;
  const [showCreateModal, setShowCreateModel] = useState(false);
  const [showUpdateModal, setShowUpdateModel] = useState(false);
  let [selectedId, setSelectdId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!colorContext?.loadColor) return;
    colorContext.loadColor();
  }, []);

  const openCreateModal = useCallback(() => {
    setShowCreateModel(true);
  }, [setShowCreateModel]);

  const closeCreateModal = useCallback(() => {
    setShowCreateModel(false);
  }, [setShowCreateModel]);

  const openUpdateModal = useCallback(() => {
    setShowUpdateModel(true);
  }, [setShowCreateModel]);

  const closeUpdateModal = useCallback(() => {
    setShowUpdateModel(false);
  }, [setShowCreateModel]);

  const onClickRow = useCallback(
    (e) => {
      setSelectdId(e.currentTarget.dataset?.id);
      openUpdateModal();
    },
    [openUpdateModal, setSelectdId, selectedId]
  );

  const tableHeader = useMemo(() => {
    if (!colors || !colors?.[0]) return;
    const keys = Object.keys(colors[0]);
    return keys.map((key) => {
      return <th key={key}>{key}</th>;
    });
  }, [colors]);

  const tableBody = useMemo(() => {
    if (!colors) return null;
    return colors.map((color) => {
      const values = Object.values(color);
      const tds = values.map((value, index) => {
        return <td key={index}>{value}</td>;
      });
      return (
        <tr data-id={color.uuid} key={color.uuid} onClick={onClickRow}>
          {tds}
        </tr>
      );
    });
  }, [colors]);

  return (
    <div>
      <Col xs="auto">
        <Button className="mb-2" onClick={openCreateModal}>
          + New Color
        </Button>
      </Col>
      <Table striped bordered hover>
        <thead>
          <tr>{tableHeader}</tr>
        </thead>
        <tbody>{tableBody}</tbody>
      </Table>
      <CreateColor show={showCreateModal} close={closeCreateModal} />
      {selectedId && <UpdateColor colorId={selectedId} show={showUpdateModal} close={closeUpdateModal} />}
    </div>
  );
});

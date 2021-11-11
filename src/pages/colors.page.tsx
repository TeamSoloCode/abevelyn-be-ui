import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import Table from "react-bootstrap/Table";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ColorContext from "../context/colors.context";
import { CreateColor } from "../components/create-color";

export const ColorsPage = React.memo(() => {
  const colorContext = useContext(ColorContext);
  const { colors } = colorContext.state;
  const [showCreateModal, setShowCreateModel] = useState(false);

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

  const tableHeader = useMemo(() => {
    if (!colors || !colors?.[0]) return;
    const keys = Object.keys(colors[0]);
    return keys.map((key) => {
      return <th>{key}</th>;
    });
  }, [colors]);

  const tableBody = useMemo(() => {
    if (!colors) return null;
    return colors.map((color) => {
      const values = Object.values(color);
      const tds = values.map((value, index) => {
        return <td key={index}>{value}</td>;
      });
      return <tr key={color.uuid}>{tds}</tr>;
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
      <Modal show={showCreateModal} onHide={closeCreateModal}>
        <Modal.Dialog>
          <Modal.Header closeButton>
            <Modal.Title>Create New Color</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <CreateColor />
          </Modal.Body>
        </Modal.Dialog>
      </Modal>
    </div>
  );
});

import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import ColorContext from "../../context/colors.context";
import { CreateColor } from "./create-color";
import { UpdateColor } from "./update-color";
import { AppRoutes } from "../../constanst";

const tableData = [
  ["Code", "code"],
  ["Name", "name"],
  ["Name in French", "nameInFrench"],
  ["Name in Vietnamese", "nameInVietnames"],
  ["Create At", "createdAt"],
  ["Update At", "updatedAt"],
];

export const ColorsPage = React.memo(() => {
  const colorContext = useContext(ColorContext);
  const { colors } = colorContext.state;
  const [showUpdateModal, setShowUpdateModel] = useState(false);
  let [selectedId, setSelectdId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!colorContext?.loadColor) return;
    colorContext.loadColor();
  }, []);

  const openUpdateModal = useCallback(() => {
    setShowUpdateModel(true);
  }, []);

  const closeUpdateModal = useCallback(() => {
    setShowUpdateModel(false);
  }, []);

  const onClickRow = useCallback(
    (e) => {
      setSelectdId(e.currentTarget.dataset?.id);
      openUpdateModal();
    },
    [openUpdateModal, setSelectdId, selectedId]
  );

  const tableHeader = useMemo(() => {
    return tableData.map(([key, _]) => {
      return <th key={key}>{key}</th>;
    });
  }, [colors]);

  const tableBody = useMemo(() => {
    if (!colors) return null;
    return colors.map((color) => {
      const tds = tableData.map(([_, value], index) => {
        return <td key={index}>{color[value]}</td>;
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
      <a className="btn" href={`/${AppRoutes.CREATE_COLORS}`}>
        <Button className="mt-1">+ Add new</Button>
      </a>
      <Table striped bordered hover>
        <thead>
          <tr>{tableHeader}</tr>
        </thead>
        <tbody>{tableBody}</tbody>
      </Table>

      {selectedId && <UpdateColor colorId={selectedId} show={showUpdateModal} close={closeUpdateModal} />}
    </div>
  );
});

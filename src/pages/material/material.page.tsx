import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { UpdateMaterial } from "./update-material";
import { AppRoutes } from "../../constanst";
import MaterialContext from "../../context/material.context";
import { IColumn, TSCTable } from "../../components/TSCTable";
import { Material } from "../../models/material.models";

export const MaterialPage = React.memo(() => {
  const materialContext = useContext(MaterialContext);
  const state = materialContext?.state;
  const materials = state?.materials;

  const [showUpdateModal, setShowUpdateModel] = useState(false);
  let [selectedId, setSelectdId] = useState<string | undefined>(undefined);

  useEffect(() => {
    materialContext?.loadMaterials();
  }, []);

  const openUpdateModal = useCallback(() => {
    setShowUpdateModel(true);
  }, [setShowUpdateModel]);

  const closeUpdateModal = useCallback(() => {
    setShowUpdateModel(false);
  }, [setShowUpdateModel]);

  const onClickRow = useCallback(
    (material: Material) => {
      setSelectdId(material.uuid);
      openUpdateModal();
    },
    [openUpdateModal, setSelectdId, selectedId]
  );

  const columns = useMemo(() => {
    return defaultColumns;
  }, []);

  return (
    <div>
      <Col xs="auto">
        <a className="btn" href={`/${AppRoutes.CREATE_MATERIAL}`}>
          <Button className="mt-1">+ New Material</Button>
        </a>
      </Col>
      <TSCTable data={materials || []} columns={columns} onRowClick={onClickRow} />
      {selectedId && <UpdateMaterial materialId={selectedId} show={showUpdateModal} close={closeUpdateModal} />}
    </div>
  );
});

const defaultColumns: IColumn<Material>[] = [
  {
    headerTitle: "Name",
    item: (item) => item.name,
  },
  {
    headerTitle: "Name in Franch",
    item: (item) => item.nameInFrench,
  },
  {
    headerTitle: "Name in Vietnamese",
    item: (item) => item.nameInVietnames,
  },
  {
    headerTitle: "Description",
    item: (item) => item.description,
  },
  {
    headerTitle: "Description in Franch",
    item: (item) => item.descriptionInFrench,
  },
  {
    headerTitle: "Description in Vietnamese",
    item: (item) => item.descriptionInVietnames,
  },
  {
    headerTitle: "Create At",
    item: (item) => item.createdAt,
  },
];

import React, { useState, useEffect, useCallback } from "react";
import {
  Grid,
  Row,
  Column,
  Button,
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TextInput,
  DataTableSkeleton,
  ToastNotification,
} from "carbon-components-react";
import { TrashCan32, Add16 } from "@carbon/icons-react";
import axios from "axios";
import "./Todo.scss";
import {
  useTodosStore,
  setTodos,
  addTodo,
  removeTodo,
} from "../stores/todoStore";

const API_URL = process.env.REACT_APP_API_URL;

const TodoList = () => {
  const [loading, setLoading] = useState(false);
  const rows = useTodosStore();
  const [value, setValue] = useState("");
  const [toast, setToast] = useState();
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL + "/todos");
      setLoading(false);
      const { data } = response || {};
      await setTodos(data);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }, []);
  useEffect(() => {
    loadData();
  }, [loadData]);
  const add = async () => {
    if (!value) return;
    try {
      const response = await axios.post(API_URL + "/todos", {
        name: value,
      });
      const { data, statusText } = response || {};
      if (statusText === "Created") {
        setToast({
          kind: "success",
          display: true,
          title: "Add new Todo",
          caption: "Successfully.",
          timeout: 3000,
        });
        setValue("");
        await addTodo(data);
      } else {
        setToast({
          kind: "error",
          display: true,
          title: "Add new Todo",
          caption: "Failed. " + statusText,
          timeout: 3000,
        });
      }
    } catch (error) {
      setToast({
        kind: "error",
        display: true,
        title: "Add new Todo",
        caption: "Failed. " + error,
        timeout: 3000,
      });
    }
  };
  const remove = async (id) => {
    try {
      const response = await axios.delete(API_URL + "/todos/" + id);
      const { statusText } = response || {};
      if (statusText === "OK") {
        setToast({
          kind: "success",
          display: true,
          title: "removal Todo",
          caption: "Successfully.",
          timeout: 3000,
        });
        setValue("");
        await removeTodo(id);
      } else {
        setToast({
          kind: "error",
          display: true,
          title: "removal Todo",
          caption: "Failed. " + statusText,
          timeout: 3000,
        });
      }
      console.log(response);
    } catch (error) {
      setToast({
        kind: "error",
        display: true,
        title: "removal Todo",
        caption: "Failed. " + error,
        timeout: 3000,
      });
    }
  };
  return (
    <Grid>
      <Row>
        <Column sm={12} md={{ span: 2, offset: 3 }}>
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <TextInput
              id="text"
              labelText=""
              placeholder="Input text ..."
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
              }}
            />
            <div style={{ marginLeft: 5 }}>
              <Button
                size="field"
                hasIconOnly
                renderIcon={Add16}
                iconDescription="Add"
                onClick={add}
              />
            </div>
          </div>
        </Column>
      </Row>
      <Row>
        <Column sm={12} md={{ span: 2, offset: 3 }}>
          {loading ? (
            <DataTableSkeleton
              showHeader={false}
              showToolbar={false}
              zebra={true}
              columnCount={2}
            />
          ) : (
            <DataTable
              rows={rows || []}
              headers={[
                {
                  key: "name",
                  header: "Name",
                },
              ]}
            >
              {({
                rows,
                headers,
                getTableProps,
                getHeaderProps,
                getRowProps,
              }) => (
                <Table {...getTableProps()}>
                  <TableHead>
                    <TableRow>
                      {headers.map((header) => (
                        <TableHeader {...getHeaderProps({ header })}>
                          {header.header}
                        </TableHeader>
                      ))}
                      <TableHeader>Actions</TableHeader>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => (
                      <TableRow {...getRowProps({ row })}>
                        {row.cells.map((cell) => {
                          return (
                            <TableCell key={cell.id}>{cell.value}</TableCell>
                          );
                        })}
                        <TableCell>
                          <Button
                            kind="danger"
                            size="small"
                            hasIconOnly
                            renderIcon={TrashCan32}
                            iconDescription="Remove"
                            onClick={() => {
                              const { id } = row;
                              remove(id);
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </DataTable>
          )}
        </Column>
      </Row>
      {toast && toast.display && (
        <ToastNotification
          kind={toast.kind}
          caption={toast.caption || ""}
          title={toast.title || ""}
          timeout={toast.timeout || 0}
          onCloseButtonClick={() => {
            setToast(null);
          }}
        />
      )}
    </Grid>
  );
};

export default TodoList;

import React from "react";
import { Field, FieldArray, ErrorMessage } from "formik";

const useRenderDoubleFieldArray = (name, values) => {
  return (
    <FieldArray
      name={name}
      render={(arrayHelpers) => (
        <div>
          {values[name] && values[name].length > 0
            ? values[name].map((item, index) => (
                <div
                  key={index}
                  className="form w-full border-slate-800 border-solid border-2 my-2"
                >
                  <label htmlFor={`${name}.${index}.id`}>ID:</label>
                  <Field
                    type="text"
                    id={`${name}.${index}.id`}
                    name={`${name}.${index}.id`}
                  />
                  <ErrorMessage name={`${name}.${index}.id`} component="div" />

                  <label htmlFor={`${name}.${index}.character`}>
                    Character:
                  </label>
                  <Field
                    type="text"
                    id={`${name}.${index}.character`}
                    name={`${name}.${index}.character`}
                  />
                  <ErrorMessage
                    name={`${name}.${index}.character`}
                    component="div"
                  />

                  <button
                    type="button"
                    className="small-btn"
                    onClick={() => arrayHelpers.remove(index)}
                  >
                    Remove {name.slice(0, -1)}
                  </button>
                </div>
              ))
            : null}
          <button
            type="button"
            className="small-btn"
            onClick={() => arrayHelpers.push({ id: "", character: "" })}
          >
            Add {name.slice(0, -1)}
          </button>
        </div>
      )}
    />
  );
};

const useRenderFieldArray = (name, values) => {
  return (
    <FieldArray
      name={name}
      render={(arrayHelpers) => (
        <div>
          {values[name] && values[name].length > 0
            ? values[name].map((idEl, index) => (
                <div className="form w-full" key={index}>
                  <Field
                    type="text"
                    id={`${name}.${index}`}
                    name={`${name}.${index}`}
                  />
                  <ErrorMessage name={`${name}.${index}`} component="div" />
                  <button
                    type="button"
                    className="small-btn"
                    onClick={() => arrayHelpers.remove(index)}
                  >
                    Remove {name.slice(0, -1)}
                  </button>
                </div>
              ))
            : null}
          <button
            type="button"
            className="small-btn"
            onClick={() => arrayHelpers.push("")}
          >
            Add {name.slice(0, -1)}
          </button>
        </div>
      )}
    />
  );
};

export { useRenderDoubleFieldArray, useRenderFieldArray };

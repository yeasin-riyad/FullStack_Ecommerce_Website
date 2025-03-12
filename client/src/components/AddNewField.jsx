import { IoIosCloseCircle } from "react-icons/io";

const AddNewField = ({newFieldName,handleNewFieldName,setNewFieldName,close}) => {
  return (
    <section className="fixed top-0 bottom-0 left-0 right-0 bg-neutral-900 bg-opacity-90 z-50 flex items-center justify-center">
      <div className="p-8 w-full max-w-sm bg-white rounded-lg shadow-md">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-2xl text-gray-800">Add New Field</h2>
          <button onClick={close}><IoIosCloseCircle size={23}/></button>

        </div>
        <form onSubmit={handleNewFieldName}>
          <div className="mb-4">
            <label htmlFor="fieldName">
              Field Name:-
            </label>
            <input
             required
             id="fieldName"
             value={newFieldName}
             onChange={(e) => setNewFieldName(e.target.value)}
             name="fieldName"
              className="bg-blue-50 border w-full p-2 focus-within:border-primary-100 rounded outline-none"
              type="text"
              placeholder="Input New Field Name"
            />
          </div>
          <button
           disabled={newFieldName.trim() === ""}
            className="w-full disabled:cursor-not-allowed bg-primary-200 text-black hover:text-white p-2 rounded hover:bg-primary-400"
            type="submit"
          >Submit</button>
        </form>
      </div>
    </section>
  );
};

export default AddNewField;

import {useEffect, useState, useCallback, useMemo} from "react";
import * as React from "react";
import {useDeleteUser, useGetUsers, usePostUser, usePutUser} from "../api/usersApi.ts";

function Access() {
    const [modal, setModal] = useState(false);
    const [httpMode, setHttpMode] = useState<"POST" | "PUT">("POST");
    const [currentEditId, setCurrentEditId] = useState<string | null>(null);

    //Form fields states
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [rfid, setRfid] = useState("");
    const [role, setRole] = useState("user");
    const [status, setStatus] = useState(true);

    const {isLoading: isLoadingGetUsers, commonFetch: getStoredUsers, data: users} = useGetUsers()
    const {commonFetch: postNewUser} = usePostUser()
    const {commonFetch: deleteStoredUser} = useDeleteUser()
    const {commonFetch: updateStoredUser} = usePutUser()


    useEffect(() => {
        getStoredUsers({}).then((success) => {
            console.log("Users fetched:", success)
        })
    }, []);

    // Función para limpiar campos - memoizada
    const cleanFields = useCallback(() => {
        setName("");
        setEmail("");
        setRfid("");
        setRole("user");
        setStatus(true);
    }, []);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        if (httpMode === "POST") {
            await postNewUser({
                input: {
                    name: name,
                    email: email,
                    rfid_uid: rfid,
                    role: role,
                    active: status
                }
            })
        }

        if (httpMode === "PUT") {
            await updateStoredUser({
                input: {
                    name: name,
                    email: email,
                    rfid_uid: rfid,
                    role: role,
                    active: status
                },
                urlParams: `/${currentEditId}`
            })
        }

        await getStoredUsers({})

        setModal(false)
        cleanFields()
    }, [httpMode, name, email, rfid, role, status, currentEditId, postNewUser, updateStoredUser, getStoredUsers, cleanFields]);

    const handleEdit = useCallback((user_id: string) => {
        // @ts-ignore
        const userToEdit = users?.find(user => user._id === user_id);
        if (!userToEdit) {
            return
        }
        setHttpMode("PUT");
        setCurrentEditId(user_id);
        
        setName(userToEdit.name);
        setEmail(userToEdit.email);
        setRfid(userToEdit.rfid_uid);
        setRole(userToEdit.role);
        setStatus(userToEdit.active);
        setModal(true);
    }, [users]);

    const deleteUser = useCallback(async (user_id: string) => {
        await deleteStoredUser({
            urlParams: `/${user_id}`
        })

        await getStoredUsers({})
    }, [deleteStoredUser, getStoredUsers]);

    const handleOpenModal = useCallback(() => {
        setModal(true);
        setHttpMode("POST");
        cleanFields();
    }, [cleanFields]);

    const handleCloseModal = useCallback(() => {
        setModal(false);
        cleanFields();
    }, [cleanFields]);

    return (
        <div className="w-full max-w-5xl mx-auto px-4">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-2xl font-bold">Usuarios</h2>

                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
                    id="openCreateModal"
                    onClick={handleOpenModal}
                >
                    + Nuevo Usuario
                </button>
            </div>

            {/* USERS TABLE */}
            <div className="bg-[#1e2532] rounded-xl overflow-hidden border border-[#2a3240]">
                <table className="w-full text-left">
                    <thead className="bg-[#2a3240] text-gray-300">
                    <tr>
                        <th className="p-4">Nombre</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">RFID</th>
                        <th className="p-4">Rol</th>
                        <th className="p-4">Estado</th>
                        <th className="p-4 text-right">Acciones</th>
                    </tr>
                    </thead>

                    <tbody className="text-white">
                    {isLoadingGetUsers ? (
                        <tr>
                            <td colSpan={6} className="p-4 text-center">Loading...</td>
                        </tr>
                    ) : (
                        users?.map((user) => (
                            <tr className="border-t border-[#2a3240]" key={user._id}>
                                <td className="p-4">{user.name}</td>
                                <td className="p-4">{user.email}</td>
                                <td className="p-4">{user.rfid_uid}</td>
                                <td className="p-4">{user.role}</td>

                                <td className="p-4">
                                    <span
                                        className={`px-2 py-1 text-sm rounded ${user.active ? "bg-green-600 text-green-100" : "bg-red-600 text-red-100"}`}>
                                        {user.active ? "Activo" : "Desactivado"}
                                    </span>
                                </td>

                                <td className="p-4 text-right flex gap-3 justify-end">
                                    <button 
                                        className="text-blue-400 hover:text-blue-300" 
                                        id="editUserBtn"
                                        onClick={() => handleEdit(user._id)}
                                    >
                                        Editar
                                    </button>

                                    <button 
                                        className="text-red-400 hover:text-red-300" 
                                        id="deleteUserBtn"
                                        onClick={() => deleteUser(user._id)}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {/* ======= MODAL ======= */}
            <div
                id="createUserModal"
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center transition-opacity 
                    ${!modal ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"}
                `}
            >
                <div className="bg-[#1e2532] w-full max-w-lg rounded-xl shadow-lg p-6 border border-[#2a3240]">

                    {/* MODAL HEADER */}
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-white">
                            {httpMode === "POST" ? "Nuevo Usuario" : "Editar Usuario"}
                        </h3>

                        <button 
                            className="text-gray-400 hover:text-gray-200" 
                            id="closeCreateModal" 
                            onClick={handleCloseModal}
                        >
                            ✕
                        </button>
                    </div>

                    {/* FORM */}
                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>

                        <div>
                            <label className="block text-gray-300 text-sm">Nombre</label>
                            <input
                                type="text"
                                className="w-full mt-1 px-3 py-2 rounded-lg bg-[#2a3240] text-white outline-none border border-transparent focus:border-blue-500"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-300 text-sm">Email</label>
                            <input
                                type="email"
                                className="w-full mt-1 px-3 py-2 rounded-lg bg-[#2a3240] text-white outline-none border border-transparent focus:border-blue-500"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-300 text-sm">RFID UID</label>
                            <input
                                type="text"
                                className="w-full mt-1 px-3 py-2 rounded-lg bg-[#2a3240] text-white outline-none border border-transparent focus:border-blue-500"
                                value={rfid}
                                onChange={(e) => setRfid(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-300 text-sm">Rol</label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full mt-1 px-3 py-2 rounded-lg bg-[#2a3240] text-white outline-none border border-transparent focus:border-blue-500"
                            >
                                <option value="admin">Admin</option>
                                <option value="user">User</option>
                                <option value="guest">Guest</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-300 text-sm">Estado</label>
                            <select
                                value={status ? "true" : "false"}
                                onChange={(e) => setStatus(e.target.value === "true")}
                                className="w-full mt-1 px-3 py-2 rounded-lg bg-[#2a3240] text-white outline-none border border-transparent focus:border-blue-500"
                            >
                                <option value="true">Activo</option>
                                <option value="false">Desactivado</option>
                            </select>
                        </div>

                        {/* BUTTONS */}
                        <div className="flex justify-end gap-3 mt-4">
                            <button 
                                type="button"
                                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
                                onClick={handleCloseModal}
                            >
                                Cancelar
                            </button>

                            <button 
                                type="submit"
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                            >
                                Guardar
                            </button>
                        </div>

                    </form>

                </div>
            </div>

        </div>

    )
}

export default Access;
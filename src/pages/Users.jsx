

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiGet, apiPost, apiPut, apiDelete } from '../helpers/api';

function Users() {
  const [users, setUsers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'staff', branches: [] });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const lang = document.documentElement.getAttribute('lang') || 'ar';

  const translations = {
    en: {
      users: 'Users',
      name: 'Name',
      email: 'Email',
      role: 'Role',
      branches: 'Branches',
      addUser: 'Add User',
      updateUser: 'Update User',
      cancel: 'Cancel',
      delete: 'Delete',
      error: 'An error occurred',
      success: 'User created successfully',
      updateSuccess: 'User updated successfully',
    },
    ar: {
      users: 'المستخدمين',
      name: 'الاسم',
      email: 'البريد الإلكتروني',
      role: 'الدور',
      branches: 'الفروع',
      addUser: 'إضافة مستخدم',
      updateUser: 'تحديث المستخدم',
      cancel: 'إلغاء',
      delete: 'حذف',
      error: 'حدث خطأ',
      success: 'تم إنشاء المستخدم بنجاح',
      updateSuccess: 'تم تحديث المستخدم بنجاح',
    },
  };

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await apiGet('/auth/profile');
        if (res.data.role !== 'admin') {
          navigate('/dashboard');
        } else {
          fetchUsers();
          fetchBranches();
        }
      } catch (err) {
        setError(translations[lang].error);
        navigate('/');
      }
    };
    checkAdmin();
  }, [navigate, lang]);

  const fetchUsers = async () => {
    try {
      const res = await apiGet('/users');
      setUsers(res.data);
    } catch (err) {
      setError(err.response?.data?.message || translations[lang].error);
    }
  };

  const fetchBranches = async () => {
    try {
      const res = await apiGet('/branches');
      setBranches(res.data);
    } catch (err) {
      setError(err.response?.data?.message || translations[lang].error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBranchChange = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setFormData({ ...formData, branches: selected });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...formData };
      if (editingId) {
        await apiPut(`/users/${editingId}`, data);
        setSuccess(translations[lang].updateSuccess);
      } else {
        await apiPost('/auth/register', data);
        setSuccess(translations[lang].success);
      }
      setFormData({ name: '', email: '', password: '', role: 'staff', branches: [] });
      setEditingId(null);
      fetchUsers();
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || translations[lang].error);
    }
  };

  const handleEdit = (user) => {
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      branches: user.branches?.map(b => b._id) || [],
    });
    setEditingId(user._id);
  };

  const handleDelete = async (id) => {
    try {
      await apiDelete(`/users/${id}`);
      fetchUsers();
      setSuccess('User deleted successfully');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || translations[lang].error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">{translations[lang].users}</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="card mb-4">
        <div className="card-body">
          <h3 className="card-title">{editingId ? translations[lang].updateUser : translations[lang].addUser}</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">{translations[lang].name}</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">{translations[lang].email}</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">{translations[lang].password}</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="form-control"
                required={!editingId}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">{translations[lang].role}</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="form-select"
                required
              >
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">{translations[lang].branches}</label>
              <select
                name="branches"
                value={formData.branches}
                onChange={handleBranchChange}
                className="form-select"
                multiple
              >
                {branches.map((branch) => (
                  <option key={branch._id} value={branch._id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-primary">
              {editingId ? translations[lang].updateUser : translations[lang].addUser}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn btn-secondary ms-2"
                onClick={() => {
                  setFormData({ name: '', email: '', password: '', role: 'staff', branches: [] });
                  setEditingId(null);
                }}
              >
                {translations[lang].cancel}
              </button>
            )}
          </form>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="table-primary">
            <tr>
              <th>{translations[lang].name}</th>
              <th>{translations[lang].email}</th>
              <th>{translations[lang].role}</th>
              <th>{translations[lang].branches}</th>
              <th>{translations[lang].actions}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.branches?.map(b => b.name).join(', ') || 'N/A'}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEdit(user)}
                  >
                    {translations[lang].edit}
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(user._id)}
                  >
                    {translations[lang].delete}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Users;
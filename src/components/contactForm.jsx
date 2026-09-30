import { useState } from 'react';
import emailjs from '@emailjs/browser';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    nombreApellido: '',
    email: '',
    mensaje: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const validate = () => {
    const newErrors = {};

    if (!formData.nombreApellido.trim()) {
      newErrors.nombreApellido = 'El Nombre y Apellido es obligatorio.';
    } else if (formData.nombreApellido.trim().length < 3) {
      newErrors.nombreApellido = 'Debe ingresar al menos 3 caracteres.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'El correo electrónico es obligatorio.';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Ingrese un correo electrónico válido.';
    }

    if (!formData.mensaje.trim()) {
      newErrors.mensaje = 'El mensaje no puede estar vacío.';
    } else if (formData.mensaje.length > 300) {
      newErrors.mensaje = 'El mensaje no puede superar los 300 caracteres.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setStatusMessage('');

    // Reemplaza estas cadenas con tus datos reales de EmailJS
    const SERVICE_ID = 'service_3hvg3nd';
    const TEMPLATE_ID = 'template_98kkp7u';
    const PUBLIC_KEY = 'oB_4v5u6EogLLKQqC';

    const templateParams = {
      from_name: formData.nombreApellido,
      from_email: formData.email,
      message: formData.mensaje,
    };

    emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
      .then(() => {
        setStatusMessage('¡Mensaje enviado con éxito!');
        setFormData({ nombreApellido: '', email: '', mensaje: '' });
        setErrors({});
      })
      .catch((err) => {
        console.error('Error al enviar:', err);
        setStatusMessage('Ocurrió un error al enviar el mensaje. Intente nuevamente.');
      })
      .finally(() => setIsSubmitting(false));
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      {statusMessage && <p className="status-msg">{statusMessage}</p>}

      <div className="form-group">
        <label htmlFor="nombreApellido">Nombre y Apellido</label>
        <input
          type="text"
          id="nombreApellido"
          name="nombreApellido"
          value={formData.nombreApellido}
          onChange={handleChange}
        />
        {errors.nombreApellido && <span className="error-msg">{errors.nombreApellido}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="email">Correo Electrónico</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <span className="error-msg">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="mensaje">Mensaje</label>
        <textarea
          id="mensaje"
          name="mensaje"
          rows={4}
          maxLength={300}
          value={formData.mensaje}
          onChange={handleChange}
        />
        <small className="char-count">{formData.mensaje.length}/300 caracteres</small>
        {errors.mensaje && <span className="error-msg">{errors.mensaje}</span>}
      </div>

      <button type="submit" disabled={isSubmitting} className="btn-submit">
        {isSubmitting ? 'Enviando...' : 'Enviar'}
      </button>
    </form>
  );
}
import { useCallback, useRef, useState } from 'react';

// Tiny form state + validation hook.
//   const form = useForm({ Email: '' }, { Email: compose(required('Email'), email) });
//   <FormField value={form.values.Email} error={form.errors.Email}
//              onChangeText={v => form.set('Email', v)} onBlur={() => form.blur('Email')} />
//   const { ok, firstError } = form.validateAll();   // marks every field as touched
//
// Errors only show for fields that were touched (blurred / submitted), so the form does
// not shout at the user while they type for the first time. After that they update live.
// Define `schema` outside the component (or useMemo it) so callbacks stay stable.
export default function useForm(initialValues, schema = {}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const valuesRef = useRef(initialValues);
  const touchedRef = useRef({});

  const run = useCallback((name, vals) => (schema[name] ? schema[name](vals[name], vals) : null), [schema]);

  const set = useCallback((name, value) => {
    const next = { ...valuesRef.current, [name]: value };
    valuesRef.current = next;
    setValues(next);
    if (touchedRef.current[name]) setErrors(e => ({ ...e, [name]: run(name, next) }));
    // a dependent field (e.g. confirm password) may need re-checking too
    Object.keys(touchedRef.current).forEach(other => {
      if (other !== name && touchedRef.current[other] && schema[other]) {
        setErrors(e => ({ ...e, [other]: run(other, next) }));
      }
    });
  }, [run, schema]);

  const blur = useCallback(name => {
    touchedRef.current[name] = true;
    setErrors(e => ({ ...e, [name]: run(name, valuesRef.current) }));
  }, [run]);

  // Validate everything; returns { ok, firstKey, firstError }
  const validateAll = useCallback(() => {
    const vals = valuesRef.current;
    const nextErrors = {};
    let firstKey = null;
    Object.keys(schema).forEach(name => {
      touchedRef.current[name] = true;
      const err = run(name, vals);
      nextErrors[name] = err;
      if (err && !firstKey) firstKey = name;
    });
    setErrors(nextErrors);
    return { ok: !firstKey, firstKey, firstError: firstKey ? nextErrors[firstKey] : null };
  }, [schema, run]);

  const reset = useCallback((next = initialValues) => {
    valuesRef.current = next;
    touchedRef.current = {};
    setValues(next);
    setErrors({});
  }, [initialValues]);

  return { values, errors, set, blur, validateAll, reset, setValues };
}

import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';
import Form from 'antd/es/form';
import Fuse from 'fuse.js';
import PropTypes from 'prop-types';
import AutoCompleteInternal from 'antd/es/auto-complete';

export default function AutoComplete({
  form,
  options,
  name,
  initialValue,
  renderSelected,
  renderOption,
  label,
  empty,
  placeholder,
  keys,
}) {
  const currentValue = Form.useWatch(name, form);
  const [extra, setExtra] = useState(<div className="description">None</div>);
  const [shownOptions, setShownOptions] = useState(options);
  const updateExtra = (nextValue, currentOptions) => {
    if (nextValue && currentOptions) {
      setExtra(renderSelected(nextValue, currentOptions));
    } else {
      setExtra(<div className="description">None</div>);
    }
  };

  const search = useMemo(
    () => new Fuse(options, {
      keys,
      distance: 3,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [options], // Adding keys here would add no value and would be annoying, since keys are an array
  );

  useEffect(() => {
    updateExtra(initialValue, options);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValue, options]); // update extra uses a function from props, users should not be forced to use useCallback

  return (
    <Form.Item
      name={name}
      label={label}
      extra={extra}
    >
      <AutoCompleteInternal
        disabled={!options?.length}
        placeholder={!options?.length ? empty : placeholder}
        onSelect={(_, { value }) => {
          form.setFieldValue(name, value);
          updateExtra(value, options);
        }}
        onFocus={() => setShownOptions(options)}
        onSearch={(value) => setShownOptions(search.search(value).map(({ item }) => item))}
        options={shownOptions?.map(renderOption) || []}
        onBlur={() => updateExtra(currentValue, options)}
      />
    </Form.Item>
  );
}

AutoComplete.propTypes = {
  form: PropTypes.shape({ setFieldValue: PropTypes.func.isRequired }).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  options: PropTypes.array,
  name: PropTypes.string.isRequired,
  initialValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  renderSelected: PropTypes.func.isRequired,
  renderOption: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  empty: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  keys: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
};

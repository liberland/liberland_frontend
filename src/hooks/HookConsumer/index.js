import PropTypes from 'prop-types';

function HookConsumer({
  useHook,
  params,
  children,
}) {
  const result = useHook(params);
  return children(result);
}

HookConsumer.propTypes = {
  useHook: PropTypes.func.isRequired,
  params: PropTypes.shape({}),
  children: PropTypes.func.isRequired,
};

export default HookConsumer;

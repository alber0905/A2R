import { ApiNamespace } from '../../model/client';

const namespaceToText = (namespace: ApiNamespace, level = 0): string => {
  const namespaces = namespace.namespaces.map((n): string => {
    return `${Array(level + 1)
      .fill('\t')
      .join('')}${n.key}: {
    ${Array(level + 2)
      .fill('\t')
      .join('')}${namespaceToText(n, level + 2)}
    ${Array(level + 1)
      .fill('\t')
      .join('')}}`;
  });
  const methods = namespace.methods.map((m): string => {
    return `${Array(level + 1)
      .fill('\t')
      .join('')}${m.key === m.methodName ? m.key : `${m.key}: ${m.methodName}`}`;
  });
  return [...namespaces, ...methods].join('\n');
};

const getApiObjectText = (apiObject: ApiNamespace): string => {
  return `const api = {\n${namespaceToText(apiObject)}\n};`;
};

export default getApiObjectText;

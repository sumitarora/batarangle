import { ParseUtils } from './parse-utils';
import { MutableTree } from '../../tree/mutable-tree';
import { createTree } from '../../tree/mutable-tree-factory';

test('utils/parse-utils: copyParent', () => {
  const mockData = {
    name: 'mockData',
  };

  const result = {
    name: 'mockData',
    children: undefined,
  };

  const parseUtils: ParseUtils = new ParseUtils();
  const output = parseUtils.copyParent(mockData);
  expect(result).toEqual(output);
});

test('utils/parse-utils: flatten list data', () => {
  const mockData = [
    {
      id: '0',
      name: 'mockData',
      children: [
        {
          id: '0.1',
          name: 'one',
        },
        {
          id: '0.2',
          name: 'two',
          children: [
            {
              id: '0.2.1',
              name: 'three',
            },
            {
              id: '0.2.2',
              name: 'four',
            },
          ],
        },
      ],
    },
  ];

  const result = [
    {
      children: undefined,
      id: '0',
      name: 'mockData',
    },
    {
      id: '0.1',
      name: 'one',
    },
    {
      children: undefined,
      id: '0.2',
      name: 'two',
    },
    {
      id: '0.2.1',
      name: 'three',
    },
    {
      id: '0.2.2',
      name: 'four',
    },
  ];

  const parseUtils: ParseUtils = new ParseUtils();
  const output = parseUtils.flatten(<any>mockData);
  expect(result).toEqual(output);
});

test('utils/parse-utils: getParentHierarchy', () => {
  const mockData = [
    {
      id: '0',
      name: 'mockData',
      children: [
        {
          id: '0 0',
          name: 'one',
        },
        {
          id: '0 1',
          name: 'two',
          children: [
            {
              id: '0 1 0',
              name: 'three',
            },
            {
              id: '0 1 1',
              name: 'four',
              children: [],
            },
          ],
        },
      ],
    },
  ];

  const node = {
    id: '0 1 1',
    name: 'four',
  };

  const tree = createTree(<any>mockData);

  const parseUtils: ParseUtils = new ParseUtils();
  const output = parseUtils.getParentHierarchy(tree, <any>node).map(n => n.id);

  const result = ['0', '0 1'];

  expect(result).toEqual(output);
});

test('utils/parse-utils: getParentNodeIds', () => {
  const nodeId = '0 1 22 333 444';
  const parseUtils: ParseUtils = new ParseUtils();
  const output = parseUtils.getParentNodeIds(nodeId);
  const result = ['0', '0 1', '0 1 22', '0 1 22 333'];
  expect(result).toEqual(output);
});

test('utils/parse-utils: getDependencyProvider', () => {
  const node = {
    id: '0 1 1',
    name: 'four',
    providers: [],
  };
  const mockData = [
    {
      id: '0',
      name: 'mockData',
      providers: [{ id: 'service1_id', key: 'service1' }],
      children: [
        {
          id: '0 0',
          name: 'one',
          providers: [],
        },
        {
          id: '0 1',
          name: 'two',
          providers: [],
          children: [
            {
              id: '0 1 0',
              name: 'three',
            },
            node,
          ],
        },
      ],
    },
  ];

  const dependency = { id: 'service1_id', name: 'service1', decorators: [] };

  const parseUtils: ParseUtils = new ParseUtils();

  const tree = createTree(<any>mockData);

  const output = parseUtils.getDependencyProvider(tree, node.id, dependency);
  expect(mockData[0]).toEqual(output);
});

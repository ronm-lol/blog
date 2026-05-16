import { visit } from 'unist-util-visit';

export function remarkZwsp() {
  return (tree) => {
    visit(tree, 'text', (node) => {
      let result = '';
      for (let i = 0; i < node.value.length; i++) {
        result += node.value[i];
        if (
          Math.random() < 0.15 &&
          /[a-zA-Z]/.test(node.value[i]) &&
          i < node.value.length - 1
        ) {
          result += '​';
        }
      }
      node.value = result;
    });
  };
}

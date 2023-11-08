import * as path from 'path';
const __dirname = path.resolve();

console.log('__dirname', __dirname);

export default  {
  entry: './index.ts',
  output: {
    path: path.resolve(__dirname, '/Users/xiaoqiangjiang/source/reddwarf/frontend/rd-component/dist'),
    filename: 'rd-component.js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      "@": path.resolve(__dirname, 'src'),
    },
    modules: [
      'node_modules',
      path.resolve(__dirname, 'src')
    ]
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
};
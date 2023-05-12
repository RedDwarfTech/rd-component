import type { Meta, StoryObj } from '@storybook/react';
import PaySuccess from './PaySuccess';
import SubPaySuccess from './SubPaySuccess';

const meta: Meta<typeof PaySuccess> = {
  title: 'Pay/SubPaySuccess',
  component: SubPaySuccess,
};

export default meta;

type Story = StoryObj<typeof SubPaySuccess>;

export const Primary: Story = {
  render: () => <SubPaySuccess />,
};
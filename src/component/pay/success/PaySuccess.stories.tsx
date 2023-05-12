import type { Meta, StoryObj } from '@storybook/react';
import PaySuccess from './PaySuccess';

const meta: Meta<typeof PaySuccess> = {
  title: 'Pay/PaySuccess',
  component: PaySuccess,
};

export default meta;

type Story = StoryObj<typeof PaySuccess>;

export const Primary: Story = {
  render: () => <PaySuccess refreshUser={false} />,
};
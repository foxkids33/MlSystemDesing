import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { expect, test } from 'vitest';
import '@testing-library/jest-dom';

import Greeter from './+page.svelte';

test('no initial greeting', () => {
    // Render the Greeter component with the name prop
    render(Greeter, { name: 'World' });

    const button = screen.getByRole('button', { name: 'Greet' });

    const greeting = screen.queryByText(/hello/iu);

    expect(button).toBeInTheDocument();
    expect(greeting).not.toBeInTheDocument();
});

test('greeting appears on click', async () => {
    // Set up a user event
    const user = userEvent.setup();
    render(Greeter, { name: 'World' });

    const button = screen.getByRole('button', { name: 'Greet' });
    await user.click(button);
    const greeting = screen.getByText(/hello world/iu);

    expect(greeting).toBeInTheDocument();
});

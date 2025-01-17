import { render, screen } from '@testing-library/svelte';
import { expect, test, vi } from 'vitest';
import '@testing-library/jest-dom';

import NavBar from './Navbar.svelte';

let mockUrl = 'http://localhost/'

vi.mock('$app/stores', async () => {
   const { readable } = await import('svelte/store');
   const getStores = () => ({
       page: readable({
           url: new URL(mockUrl),
           params: {},
           data: {
               session: {
                   user: {
                       image: {},
                       name: {},
                   }
               }
           }
       }),
   });
   const page = {
       subscribe(fn) {
           return getStores().page.subscribe(fn);
       }
   };
   return {
       getStores,
       page,
       __setMockUrl: (url) => {
           mockUrl = url;
   }};
});

test('displays all navigation bar links', () => {
   render(NavBar);

   expect(screen.getByRole('link', { name: /acme inc/i })).toBeInTheDocument();
   expect(screen.getByRole('link', { name: /smart seminarian/i })).toBeInTheDocument();
   expect(screen.getByRole('link', { name: /concepts/i })).toBeInTheDocument();
   expect(screen.getByRole('link', { name: /training/i })).toBeInTheDocument();
   expect(screen.getByRole('link', { name: /chat/i })).toBeInTheDocument();
});

test("home link is active and the rest are not, when url is '/'", () => {
   render(NavBar);

   const smartSeminarianLink = screen.getByRole('link', { name: /smart seminarian/i });
   const conceptsLink = screen.getByRole('link', { name: /concepts/i });
   const trainingLink = screen.getByRole('link', { name: /training/i });
   const chatLink = screen.getByRole('link', { name: /chat/i });

   expect(smartSeminarianLink).not.toHaveClass('nav-link active');
   expect(conceptsLink).not.toHaveClass('nav-link active');
   expect(trainingLink).not.toHaveClass('nav-link active');
   expect(chatLink).not.toHaveClass('nav-link active');
});

test("smartSeminarianLink is active and the rest are not, when url is '/dashboard'", async () => {
   const { __setMockUrl } = await vi.importMock('$app/stores');
   __setMockUrl('http://localhost/dashboard');

   render(NavBar);

   const smartSeminarianLink = screen.getByRole('link', { name: /smart seminarian/i });
   const conceptsLink = screen.getByRole('link', { name: /concepts/i });
   const trainingLink = screen.getByRole('link', { name: /training/i });
   const chatLink = screen.getByRole('link', { name: /chat/i });

   expect(smartSeminarianLink).toHaveClass('nav-link active');
   expect(conceptsLink).not.toHaveClass('nav-link active');
   expect(trainingLink).not.toHaveClass('nav-link active');
   expect(chatLink).not.toHaveClass('nav-link active');
});

test("conceptsLink is active and the rest are not, when url is '/concepts'", async () => {
   const { __setMockUrl } = await vi.importMock('$app/stores')
   __setMockUrl('http://localhost/concepts')

   render(NavBar);

   const smartSeminarianLink = screen.getByRole('link', { name: /smart seminarian/i });
   const conceptsLink = screen.getByRole('link', { name: /concepts/i });
   const trainingLink = screen.getByRole('link', { name: /training/i });
   const chatLink = screen.getByRole('link', { name: /chat/i });

   expect(smartSeminarianLink).not.toHaveClass('nav-link active');
   expect(conceptsLink).toHaveClass('nav-link active');
   expect(trainingLink).not.toHaveClass('nav-link active');
   expect(chatLink).not.toHaveClass('nav-link active');
});

test("trainingLink is active and the rest are not, when url is '/training'", async () => {
   const { __setMockUrl } = await vi.importMock('$app/stores')
   __setMockUrl('http://localhost/training')

   render(NavBar);

   const smartSeminarianLink = screen.getByRole('link', { name: /smart seminarian/i });
   const conceptsLink = screen.getByRole('link', { name: /concepts/i });
   const trainingLink = screen.getByRole('link', { name: /training/i });
   const chatLink = screen.getByRole('link', { name: /chat/i });

   expect(smartSeminarianLink).not.toHaveClass('nav-link active');
   expect(conceptsLink).not.toHaveClass('nav-link active');
   expect(trainingLink).toHaveClass('nav-link active');
   expect(chatLink).not.toHaveClass('nav-link active');
});

test("chat is active and the rest are not, when url is '/chat'", async () => {
   const { __setMockUrl } = await vi.importMock('$app/stores')
   __setMockUrl('http://localhost/chat')

   render(NavBar);

   const smartSeminarianLink = screen.getByRole('link', { name: /smart seminarian/i });
   const conceptsLink = screen.getByRole('link', { name: /concepts/i });
   const trainingLink = screen.getByRole('link', { name: /training/i });
   const chatLink = screen.getByRole('link', { name: /chat/i });

   expect(smartSeminarianLink).not.toHaveClass('nav-link active');
   expect(conceptsLink).not.toHaveClass('nav-link active');
   expect(trainingLink).not.toHaveClass('nav-link active');
   expect(chatLink).toHaveClass('nav-link active');
});
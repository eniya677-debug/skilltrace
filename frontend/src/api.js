const API_BASE_URL = 'http://localhost:8000';

export async function fetchHealth() {
  const response = await fetch(`${API_BASE_URL}/health`);
  if (!response.ok) throw new Error('Health check failed');
  return response.json();
}

export async function fetchIncidents() {
  const response = await fetch(`${API_BASE_URL}/incidents`);
  if (!response.ok) throw new Error('Failed to fetch incidents');
  return response.json();
}

export async function fetchIncident(id) {
  const response = await fetch(`${API_BASE_URL}/incidents/${id}`);
  if (!response.ok) throw new Error(`Failed to fetch incident #${id}`);
  return response.json();
}

export async function ingestIncident(payload) {
  const response = await fetch(`${API_BASE_URL}/incident`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error('Failed to submit incident');
  return response.json();
}

export async function resolveIncident(id, payload) {
  const response = await fetch(`${API_BASE_URL}/incidents/${id}/resolve`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`Failed to resolve incident #${id}`);
  return response.json();
}

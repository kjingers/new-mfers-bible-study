import { v4 as uuidv4 } from 'uuid';
import { getContainer, CONTAINERS } from './client';
import type { Study, Week, Family, Meal, RSVP, LiveSession } from '@/types';
import type { SqlParameter, JSONValue } from '@azure/cosmos';

type ContainerName = 'studies' | 'weeks' | 'families' | 'meals' | 'rsvps' | 'sessions';

// Generic CRUD helpers
async function create<T extends { id: string }>(
  containerName: ContainerName,
  item: Omit<T, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }
): Promise<T> {
  const container = getContainer(containerName);
  const now = new Date().toISOString();
  const newItem = {
    ...item,
    id: item.id || uuidv4(),
    createdAt: now,
    updatedAt: now,
  };

  const { resource } = await container.items.create(newItem);

  return resource as unknown as T;
}

async function getById<T>(
  containerName: ContainerName,
  id: string,
  partitionKeyValue?: string
): Promise<T | null> {
  const container = getContainer(containerName);

  try {
    const { resource } = await container.item(id, partitionKeyValue || id).read();
    return (resource as T) || null;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 404) {
      return null;
    }
    throw error;
  }
}

async function update<T extends { id: string; updatedAt?: string }>(
  containerName: ContainerName,
  id: string,
  updates: Partial<T>,
  partitionKeyValue?: string
): Promise<T> {
  const container = getContainer(containerName);
  const existing = await getById<T>(containerName, id, partitionKeyValue);

  if (!existing) {
    throw new Error(`Item not found: ${id}`);
  }

  const updatedItem = {
    ...existing,
    ...updates,
    id, // Ensure ID doesn't change
    updatedAt: new Date().toISOString(),
  };

  const { resource } = await container.item(id, partitionKeyValue || id).replace(updatedItem);
  return resource as T;
}

async function remove(
  containerName: ContainerName,
  id: string,
  partitionKeyValue?: string
): Promise<void> {
  const container = getContainer(containerName);
  await container.item(id, partitionKeyValue || id).delete();
}

async function query<T>(
  containerName: ContainerName,
  querySpec: string,
  paramValues?: JSONValue[]
): Promise<T[]> {
  const container = getContainer(containerName);
  const parameters: SqlParameter[] | undefined = paramValues?.map((value, index) => ({
    name: `@p${index}`,
    value,
  }));

  const { resources } = await container.items
    .query<T>({
      query: querySpec,
      parameters,
    })
    .fetchAll();
  return resources;
}

// Study operations
export const studies = {
  create: (study: Omit<Study, 'id' | 'createdAt' | 'updatedAt'>) =>
    create<Study>(CONTAINERS.STUDIES, study),

  getById: (id: string) => getById<Study>(CONTAINERS.STUDIES, id),

  update: (id: string, updates: Partial<Study>) => update<Study>(CONTAINERS.STUDIES, id, updates),

  delete: (id: string) => remove(CONTAINERS.STUDIES, id),

  getActive: async (): Promise<Study | null> => {
    const results = await query<Study>(
      CONTAINERS.STUDIES,
      'SELECT * FROM c WHERE c.isActive = true'
    );
    return results[0] || null;
  },

  getAll: async (): Promise<Study[]> => {
    return query<Study>(CONTAINERS.STUDIES, 'SELECT * FROM c ORDER BY c.startDate DESC');
  },

  setActive: async (id: string): Promise<Study> => {
    // First, deactivate all studies
    const allStudies = await studies.getAll();
    for (const study of allStudies) {
      if (study.isActive && study.id !== id) {
        await studies.update(study.id, { isActive: false });
      }
    }
    // Then activate the target study
    return studies.update(id, { isActive: true });
  },
};

// Week operations
export const weeks = {
  create: (week: Omit<Week, 'id' | 'createdAt' | 'updatedAt'>) =>
    create<Week>(CONTAINERS.WEEKS, week),

  getById: (id: string, studyId: string) => getById<Week>(CONTAINERS.WEEKS, id, studyId),

  update: (id: string, studyId: string, updates: Partial<Week>) =>
    update<Week>(CONTAINERS.WEEKS, id, updates, studyId),

  delete: (id: string, studyId: string) => remove(CONTAINERS.WEEKS, id, studyId),

  getByStudy: async (studyId: string): Promise<Week[]> => {
    return query<Week>(
      CONTAINERS.WEEKS,
      'SELECT * FROM c WHERE c.studyId = @p0 ORDER BY c.weekNumber',
      [studyId]
    );
  },

  getByDate: async (date: string): Promise<Week | null> => {
    const results = await query<Week>(CONTAINERS.WEEKS, 'SELECT * FROM c WHERE c.date = @p0', [
      date,
    ]);
    return results[0] || null;
  },

  getCurrentWeek: async (studyId: string): Promise<Week | null> => {
    const today = new Date().toISOString().split('T')[0];
    const results = await query<Week>(
      CONTAINERS.WEEKS,
      'SELECT * FROM c WHERE c.studyId = @p0 AND c.date >= @p1 ORDER BY c.date',
      [studyId, today]
    );
    return results[0] || null;
  },
};

// Family operations
export const families = {
  create: (family: Omit<Family, 'id' | 'createdAt'>) =>
    create<Family>(CONTAINERS.FAMILIES, family as Omit<Family, 'id' | 'createdAt' | 'updatedAt'>),

  getById: (id: string) => getById<Family>(CONTAINERS.FAMILIES, id),

  update: (id: string, updates: Partial<Family>) =>
    update<Family>(CONTAINERS.FAMILIES, id, updates),

  delete: (id: string) => remove(CONTAINERS.FAMILIES, id),

  getAll: async (): Promise<Family[]> => {
    return query<Family>(CONTAINERS.FAMILIES, 'SELECT * FROM c ORDER BY c.name');
  },

  getByName: async (name: string): Promise<Family | null> => {
    const results = await query<Family>(CONTAINERS.FAMILIES, 'SELECT * FROM c WHERE c.name = @p0', [
      name,
    ]);
    return results[0] || null;
  },

  getByCode: async (code: string): Promise<Family | null> => {
    // Case-insensitive code lookup
    const normalizedCode = code.toUpperCase().trim();
    const results = await query<Family>(
      CONTAINERS.FAMILIES,
      'SELECT * FROM c WHERE UPPER(c.code) = @p0',
      [normalizedCode]
    );
    return results[0] || null;
  },
};

// Meal operations
export const meals = {
  create: (meal: Omit<Meal, 'id' | 'createdAt' | 'updatedAt'>) =>
    create<Meal>(CONTAINERS.MEALS, meal),

  getById: (id: string, weekId: string) => getById<Meal>(CONTAINERS.MEALS, id, weekId),

  update: (id: string, weekId: string, updates: Partial<Meal>) =>
    update<Meal>(CONTAINERS.MEALS, id, updates, weekId),

  delete: (id: string, weekId: string) => remove(CONTAINERS.MEALS, id, weekId),

  getByWeek: async (weekId: string): Promise<Meal | null> => {
    const results = await query<Meal>(CONTAINERS.MEALS, 'SELECT * FROM c WHERE c.weekId = @p0', [
      weekId,
    ]);
    return results[0] || null;
  },

  getUpcoming: async (): Promise<Meal[]> => {
    const today = new Date().toISOString().split('T')[0];
    return query<Meal>(
      CONTAINERS.MEALS,
      'SELECT * FROM c WHERE c.weekId IN (SELECT VALUE w.id FROM weeks w WHERE w.date >= @p0)',
      [today]
    );
  },
};

// RSVP operations
export const rsvps = {
  create: (rsvp: Omit<RSVP, 'id' | 'createdAt' | 'updatedAt'>) =>
    create<RSVP>(CONTAINERS.RSVPS, rsvp),

  getById: (id: string, weekId: string) => getById<RSVP>(CONTAINERS.RSVPS, id, weekId),

  update: (id: string, weekId: string, updates: Partial<RSVP>) =>
    update<RSVP>(CONTAINERS.RSVPS, id, updates, weekId),

  delete: (id: string, weekId: string) => remove(CONTAINERS.RSVPS, id, weekId),

  getByWeek: async (weekId: string): Promise<RSVP[]> => {
    return query<RSVP>(CONTAINERS.RSVPS, 'SELECT * FROM c WHERE c.weekId = @p0', [weekId]);
  },

  getByFamilyAndWeek: async (familyId: string, weekId: string): Promise<RSVP | null> => {
    const results = await query<RSVP>(
      CONTAINERS.RSVPS,
      'SELECT * FROM c WHERE c.familyId = @p0 AND c.weekId = @p1',
      [familyId, weekId]
    );
    return results[0] || null;
  },

  getTotals: async (weekId: string): Promise<{ adults: number; children: number }> => {
    const weekRsvps = await rsvps.getByWeek(weekId);
    return weekRsvps.reduce(
      (acc, rsvp) => ({
        adults: acc.adults + rsvp.adultCount,
        children: acc.children + rsvp.childCount,
      }),
      { adults: 0, children: 0 }
    );
  },
};

// Live session operations
export const sessions = {
  create: (session: Omit<LiveSession, 'id' | 'startedAt' | 'updatedAt'>) =>
    create<LiveSession>(CONTAINERS.SESSIONS, {
      ...session,
      startedAt: new Date().toISOString(),
    } as Omit<LiveSession, 'id' | 'createdAt' | 'updatedAt'>),

  getById: (id: string, weekId: string) => getById<LiveSession>(CONTAINERS.SESSIONS, id, weekId),

  update: (id: string, weekId: string, updates: Partial<LiveSession>) =>
    update<LiveSession>(CONTAINERS.SESSIONS, id, updates, weekId),

  delete: (id: string, weekId: string) => remove(CONTAINERS.SESSIONS, id, weekId),

  getActiveByWeek: async (weekId: string): Promise<LiveSession | null> => {
    const results = await query<LiveSession>(
      CONTAINERS.SESSIONS,
      'SELECT * FROM c WHERE c.weekId = @p0 AND c.isActive = true',
      [weekId]
    );
    return results[0] || null;
  },

  setQuestion: async (id: string, weekId: string, questionIndex: number): Promise<LiveSession> => {
    return sessions.update(id, weekId, { currentQuestionIndex: questionIndex });
  },

  endSession: async (id: string, weekId: string): Promise<LiveSession> => {
    return sessions.update(id, weekId, { isActive: false });
  },
};

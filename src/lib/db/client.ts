import { CosmosClient, Database, Container } from '@azure/cosmos';

// Container names
export const CONTAINERS = {
  STUDIES: 'studies',
  WEEKS: 'weeks',
  FAMILIES: 'families',
  MEALS: 'meals',
  RSVPS: 'rsvps',
  SESSIONS: 'sessions',
} as const;

type ContainerName = (typeof CONTAINERS)[keyof typeof CONTAINERS];

// Singleton pattern for Cosmos client
let client: CosmosClient | null = null;
let database: Database | null = null;

/**
 * Get or create the Cosmos DB client singleton
 */
export function getCosmosClient(): CosmosClient {
  if (!client) {
    const endpoint = process.env.COSMOS_ENDPOINT;
    const key = process.env.COSMOS_KEY;

    if (!endpoint || !key) {
      throw new Error('COSMOS_ENDPOINT and COSMOS_KEY environment variables are required');
    }

    client = new CosmosClient({ endpoint, key });
  }
  return client;
}

/**
 * Get the database instance
 */
export function getDatabase(): Database {
  if (!database) {
    const dbName = process.env.COSMOS_DATABASE || 'bible-study';
    database = getCosmosClient().database(dbName);
  }
  return database;
}

/**
 * Get a container by name
 */
export function getContainer(name: ContainerName): Container {
  return getDatabase().container(name);
}

/**
 * Create all required containers if they don't exist
 * Used during initial setup
 */
export async function initializeDatabase(): Promise<void> {
  const db = getDatabase();

  // Create containers with their partition keys
  const containerConfigs: { name: ContainerName; partitionKey: string }[] = [
    { name: CONTAINERS.STUDIES, partitionKey: '/id' },
    { name: CONTAINERS.WEEKS, partitionKey: '/studyId' },
    { name: CONTAINERS.FAMILIES, partitionKey: '/id' },
    { name: CONTAINERS.MEALS, partitionKey: '/weekId' },
    { name: CONTAINERS.RSVPS, partitionKey: '/weekId' },
    { name: CONTAINERS.SESSIONS, partitionKey: '/weekId' },
  ];

  for (const config of containerConfigs) {
    await db.containers.createIfNotExists({
      id: config.name,
      partitionKey: { paths: [config.partitionKey] },
    });
  }
}

/**
 * Check if the database connection is working
 */
export async function checkConnection(): Promise<boolean> {
  try {
    const db = getDatabase();
    await db.read();
    return true;
  } catch {
    return false;
  }
}

/**
 * Reset the client (useful for testing)
 */
export function resetClient(): void {
  client = null;
  database = null;
}

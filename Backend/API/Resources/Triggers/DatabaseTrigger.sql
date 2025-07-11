CREATE OR REPLACE FUNCTION notify_artifact_name_updated()
RETURNS TRIGGER AS $$
BEGIN
	PERFORM pg_notify('artifact_update', 'changed');
	RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS artifact_name_updated_trigger ON GameArtifactNames;

CREATE TRIGGER artifact_name_updated_trigger
AFTER INSERT OR UPDATE ON GameArtifactNames
FOR EACH STATMENT
EXECUTE FUNCTION notify_artifact_name_updated();
CREATE OR REPLACE FUNCTION notify_artifact_name_updated()
RETURNS TRIGGER AS $$
BEGIN
	PERFORM pg_notify('artifact_names_update', 'game:' || NEW.GameId::text);
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS artifact_name_updated_trigger ON "GameArtifactNames";

CREATE TRIGGER artifact_name_updated_trigger
AFTER INSERT OR UPDATE OR DELETE ON "GameArtifactNames"
FOR EACH ROW
EXECUTE FUNCTION notify_artifact_name_updated();
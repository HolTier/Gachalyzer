-- GameArtifactNames
CREATE OR REPLACE FUNCTION notify_artifact_name_updated()
RETURNS TRIGGER AS $$
DECLARE
    game_id TEXT;
BEGIN
    IF (TG_OP = 'DELETE') THEN
        game_id := OLD."GameId"::text;
    ELSE
        game_id := NEW."GameId"::text;
    END IF;
    PERFORM pg_notify('artifact_names_update', 'game:' || game_id);
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS artifact_name_updated_trigger ON "GameArtifactNames";

CREATE TRIGGER artifact_name_updated_trigger
AFTER INSERT OR UPDATE OR DELETE ON "GameArtifactNames"
FOR EACH ROW
EXECUTE FUNCTION notify_artifact_name_updated();

-- Games
CREATE OR REPLACE FUNCTION notify_game_updated()
RETURNS TRIGGER AS $$
DECLARE
    game_id TEXT;
BEGIN
    IF (TG_OP = 'DELETE') THEN
        game_id := OLD."Id"::text;
    ELSE
        game_id := NEW."Id"::text;
    END IF;
    PERFORM pg_notify('game_update', game_id);
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS game_updated_trigger ON "Games";

CREATE TRIGGER game_updated_trigger
AFTER INSERT OR UPDATE OR DELETE ON "Games"
FOR EACH ROW
EXECUTE FUNCTION notify_game_updated();

-- GameStats
CREATE OR REPLACE FUNCTION notify_game_stat_updated()
RETURNS TRIGGER AS $$
DECLARE
    game_id TEXT;
BEGIN
    IF (TG_OP = 'DELETE') THEN
        game_id := OLD."GameId"::text;
    ELSE
        game_id := NEW."GameId"::text;
    END IF;
    PERFORM pg_notify('game_stat_update', game_id);
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS game_stat_updated_trigger ON "GameStats";

CREATE TRIGGER game_stat_updated_trigger
AFTER INSERT OR UPDATE OR DELETE ON "GameStats"
FOR EACH ROW
EXECUTE FUNCTION notify_game_stat_updated();

-- StatTypes
CREATE OR REPLACE FUNCTION notify_stat_type_updated()
RETURNS TRIGGER AS $$
DECLARE
    stat_type_id TEXT;
BEGIN
    IF (TG_OP = 'DELETE') THEN
        stat_type_id := OLD."Id"::text;
    ELSE
        stat_type_id := NEW."Id"::text;
    END IF;
    PERFORM pg_notify('stat_type_update', stat_type_id);
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS stat_type_updated_trigger ON "StatTypes";

CREATE TRIGGER stat_type_updated_trigger
AFTER INSERT OR UPDATE OR DELETE ON "StatTypes"
FOR EACH ROW
EXECUTE FUNCTION notify_stat_type_updated();
